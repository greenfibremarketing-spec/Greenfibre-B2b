import { redirect } from "next/navigation";

export const metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: "https://trade.greenfibre.org/story" }
};

export default function OurStoryRedirect() {
  redirect("/story");
}
