"""
GreenFibre B2B VPS Deployment Pipeline Script
Usage: python deploy.py
"""
import os
import sys
import tarfile
import paramiko

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

SSH_HOST = os.environ.get('VPS_HOST', '72.61.250.120')
SSH_PORT = int(os.environ.get('VPS_PORT', 22))
SSH_USER = os.environ.get('VPS_USER', 'root')
SSH_PASS = os.environ.get('VPS_PASS', 'Root@#1234567')

LOCAL_DIR = os.path.dirname(os.path.abspath(__file__))
LOCAL_ARCHIVE = os.path.join(LOCAL_DIR, "b2b_deploy.tar.gz")
REMOTE_TARGET_DIR = "/var/www/greenfibre-b2b"
REMOTE_ARCHIVE_PATH = "/root/b2b_deploy.tar.gz"

def should_exclude(path):
    normalized = path.replace('\\', '/')
    parts = normalized.split('/')
    exclude_dirs = {'node_modules', '.next', '.git', '.data', '.idea', '.vscode'}
    for p in parts:
        if p in exclude_dirs:
            return True
    filename = os.path.basename(path)
    if filename.startswith('.env') or filename == '.env':
        return True
    return False

def make_tarfile(output_filename, source_dir):
    print("📦 Packing B2B codebase...")
    count = 0
    with tarfile.open(output_filename, "w:gz") as tar:
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                full_path = os.path.join(root, file)
                if should_exclude(full_path):
                    continue
                rel_path = os.path.relpath(full_path, source_dir)
                tar.add(full_path, arcname=rel_path.replace('\\', '/'))
                count += 1
    print(f"✨ Packed {count} files into archive.")

def run_ssh_command(ssh, cmd, description):
    print(f"🚀 Running: {description}...")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    exit_status = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='ignore')
    err = stderr.read().decode('utf-8', errors='ignore')
    if exit_status != 0:
        print(f"❌ Error during: {description} (Exit status: {exit_status})")
        if out:
            print("--- STDOUT ---")
            print(out)
        if err:
            print("--- STDERR ---")
            print(err)
        sys.exit(1)
    else:
        print(f"✅ Success: {description}")
        return out

def main():
    if not os.path.exists(LOCAL_DIR):
        print(f"❌ Directory not found: {LOCAL_DIR}")
        sys.exit(1)

    make_tarfile(LOCAL_ARCHIVE, LOCAL_DIR)

    try:
        print(f"🔌 Connecting via SFTP to {SSH_HOST}...")
        transport = paramiko.Transport((SSH_HOST, SSH_PORT))
        transport.connect(username=SSH_USER, password=SSH_PASS)
        sftp = paramiko.SFTPClient.from_transport(transport)

        print("📤 Uploading B2B archive to VPS...")
        sftp.put(LOCAL_ARCHIVE, REMOTE_ARCHIVE_PATH)
        sftp.close()
        transport.close()

        print(f"🔌 Connecting via SSH to {SSH_HOST}...")
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(SSH_HOST, port=SSH_PORT, username=SSH_USER, password=SSH_PASS)

        # 1. Target directory
        run_ssh_command(ssh, f"mkdir -p {REMOTE_TARGET_DIR}", "Creating target directory")

        # 2. Extract
        run_ssh_command(ssh, f"tar -xzf {REMOTE_ARCHIVE_PATH} -C {REMOTE_TARGET_DIR}", "Extracting codebase on VPS")
        run_ssh_command(ssh, f"rm -f {REMOTE_ARCHIVE_PATH}", "Cleaning temporary archive")

        # 3. Install dependencies
        run_ssh_command(ssh, f"cd {REMOTE_TARGET_DIR} && npm install", "Installing npm dependencies on VPS")

        # 4. Build Next.js
        run_ssh_command(ssh, f"cd {REMOTE_TARGET_DIR} && npm run build", "Building Next.js production bundle on VPS")

        # 5. PM2 restart
        pm2_cmd = f"cd {REMOTE_TARGET_DIR} && (pm2 restart greenfibre-b2b || pm2 start npm --name greenfibre-b2b -- start -- -p 3002) && pm2 save"
        run_ssh_command(ssh, pm2_cmd, "Restarting PM2 process for greenfibre-b2b")

        # 6. Verify
        status = run_ssh_command(ssh, "pm2 list", "Checking final PM2 list")
        print("\n🏆 --- GREENFIBRE B2B DEPLOYED SUCCESSFULLY --- 🏆")
        print(status)

        test_out = run_ssh_command(ssh, "curl -s -I http://127.0.0.1:3002 | head -n 5", "Testing local response on port 3002")
        print("Test output:\n", test_out)

        ssh.close()

    except Exception as e:
        print(f"❌ Deployment failed: {e}")
        sys.exit(1)
    finally:
        if os.path.exists(LOCAL_ARCHIVE):
            os.remove(LOCAL_ARCHIVE)

if __name__ == '__main__':
    main()
