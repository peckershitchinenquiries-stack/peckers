import Link from "next/link";
import { buildPageMetadata } from "../lib/seo";

export async function generateMetadata({ searchParams }) {
  return buildPageMetadata({
    searchParams,
    title: "Rewards Terms & Conditions | Peckers Inner Circle",
    description:
      "Read the full terms and conditions for the Peckers Inner Circle rewards programme — earning Chicken Heads, redeeming rewards, tier levels and more.",
    keywords: [
      "Peckers rewards terms",
      "Peckers Inner Circle T&Cs",
      "Chicken Heads terms",
      "Peckers loyalty programme terms",
      "Peckers rewards conditions",
    ],
    path: "/rewards-terms",
  });
}

export default function RewardsTermsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-12 py-24 md:py-32">
      <div className="max-w-4xl mx-auto">
        <p
          className="text-[#d4a838] tracking-[5.8px] text-xs sm:text-sm font-bold uppercase mb-4"
          style={{ fontFamily: "var(--font-peakers)" }}
        >
          The Inner Circle
        </p>
        <h1 className="font-peakers text-5xl md:text-7xl mb-6 tracking-tight uppercase">
          Rewards — Terms & Conditions
        </h1>
        <p className="text-white/60 text-base md:text-lg mb-12 font-sans">
          Peckers Inner Circle — the Peckers Loyalty Programme.
        </p>

        {/* Tier summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-[#1c1b19] border border-white/10 rounded-2xl p-5">
            <h3
              className="text-[#d4a838] text-lg uppercase mb-2 tracking-wider"
              style={{ fontFamily: "var(--font-peakers-bold)" }}
            >
              Recruit
            </h3>
            <p className="text-white/70 text-sm">Sign up for the Peckers Loyalty program and start collecting chicken head stamps on every order of £12 or more.</p>
          </div>
          <div className="bg-[#1c1b19] border border-white/10 rounded-2xl p-5">
            <h3
              className="text-[#d4a838] text-lg uppercase mb-2 tracking-wider"
              style={{ fontFamily: "var(--font-peakers-bold)" }}
            >
              Gamma
            </h3>
            <p className="text-white/70 text-sm">
              Earn 3 Chicken Head stamps — <span className="text-white">free side</span>
            </p>
          </div>
          <div className="bg-[#1c1b19] border border-white/10 rounded-2xl p-5">
            <h3
              className="text-[#d4a838] text-lg uppercase mb-2 tracking-wider"
              style={{ fontFamily: "var(--font-peakers-bold)" }}
            >
              Beta
            </h3>
            <p className="text-white/70 text-sm">
              Earn 6 Chicken Head stamps — <span className="text-white">free main</span>
            </p>
          </div>
          <div className="bg-[#1c1b19] border border-white/10 rounded-2xl p-5">
            <h3
              className="text-[#d4a838] text-lg uppercase mb-2 tracking-wider"
              style={{ fontFamily: "var(--font-peakers-bold)" }}
            >
              Alpha
            </h3>
            <p className="text-white/70 text-sm">
              Earn 10 Chicken Head stamps — <span className="text-white">free meal</span>
            </p>
          </div>
        </div>

        <div className="space-y-12 text-white/80 leading-relaxed font-sans text-lg">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
              1. About the Programme
            </h2>
            <p>
              The Peckers Inner Circle (&ldquo;the Peckers Loyalty Programme&rdquo;) is a digital loyalty
              scheme operated by Peckers Chicken Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), with locations in
              Hitchin and Stevenage, Hertfordshire. By registering for or using the Programme, you
              agree to these terms and conditions in full.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
              2. Eligibility
            </h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>The Programme is open to customers aged 16 and over.</li>
              <li>One account per person. Accounts are personal and non-transferable.</li>
              <li>
                You must register via the Peckers Loyalty Programme or via our website at{" "}
                <a
                  href="https://peckerschicken.co.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d4a838] hover:underline"
                >
                  peckerschicken.co.uk
                </a>{" "}
                to participate.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
              3. Earning Chicken Heads
            </h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                You earn one Chicken Head for each day on which you spend £12.00 or more in a
                single transaction.
              </li>
              <li>
                Only one Chicken Head is awarded per day, regardless of how many qualifying
                transactions you make.
              </li>
              <li>
                Chicken Heads can be earned when eating in, via Click &amp; Collect, or on orders
                placed through our website.
              </li>
              <li>Chicken Heads cannot be earned on transactions where a reward is redeemed.</li>
              <li>Chicken Heads have no monetary value and cannot be exchanged for cash.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
              4. Tier Levels &amp; Rewards
            </h2>
            <p className="mb-4">
              As you collect Chicken Heads, you progress through the following tiers. Rewards are
              issued upon reaching each tier threshold:
            </p>
            <ul className="space-y-3 pl-2">
              <li>
                <span className="text-white font-semibold">Recruit</span> — Sign up for the Peckers
                Loyalty program and start collecting chicken head stamps on every order of £12 or
                more.
              </li>
              <li>
                <span className="text-white font-semibold">Gamma</span> — earned by collecting the
                required number of Chicken Heads. Reward: one free side dish.
              </li>
              <li>
                <span className="text-white font-semibold">Beta</span> — earned by continuing to
                collect Chicken Heads. Reward: one free main dish.
              </li>
              <li>
                <span className="text-white font-semibold">Alpha</span> — the top tier, reached at
                10 Chicken Heads. Reward: one free meal.
              </li>
            </ul>
            <p className="mt-4">
              The specific Chicken Head thresholds for each tier are displayed within your account
              on our ordering platform. Tier requirements and rewards are subject to change with
              notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
              5. How the Chicken Heads Rewards Work
            </h2>
            <p className="mb-4">
              <span className="text-white font-semibold">
                Collect 3 Chicken Heads to unlock a Gamma Reward — a free side of your choice.
              </span>{" "}
              Simply add any side from the menu to your cart during checkout to redeem.
            </p>
            <p className="mb-2 text-white font-semibold">
              Collect 6 Chicken Heads to unlock a Beta Reward — a free main item. Eligible items
              include:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>OG Burger</li>
              <li>OG Grilled Burger</li>
              <li>Peckerless OG Burger</li>
              <li>Any 4 Wings</li>
              <li>Any 3 Tenders</li>
            </ul>
            <p className="mb-2 text-white font-semibold">
              Collect 10 Chicken Heads to unlock an Alpha Reward — a free meal. Eligible meals
              include:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>OG Burger Meal</li>
              <li>OG Grilled Burger Meal</li>
              <li>Peckerless OG Burger Meal</li>
              <li>Any 4 Wings Meal</li>
              <li>Any 3 Tenders Meal</li>
            </ul>
            <p className="text-white/90 italic">
              Once you redeem your Alpha Reward (10 Chicken Heads), your reward progress will reset
              back to 1 Chicken Head, and you can start earning rewards again.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
              6. Redeeming Rewards
            </h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Rewards are valid for 30 days from the date they are issued. Unredeemed rewards
                will expire and cannot be reinstated.
              </li>
              <li>
                Rewards can be redeemed when eating in, via Click &amp; Collect, or on orders
                placed through our website.
              </li>
              <li>
                Rewards cannot be exchanged for cash, transferred to another account, or used in
                conjunction with any other offer or promotion unless explicitly stated.
              </li>
              <li>Only one reward may be redeemed per transaction.</li>
              <li>
                Rewards must be applied at checkout; we are unable to apply them retrospectively.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
              7. Digital Wallet &amp; Member Code
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You can add your loyalty card to your device&apos;s digital wallet for easy
                in-store scanning.
              </li>
              <li>Alternatively, your unique member code can be used when ordering online.</li>
              <li>
                You are responsible for keeping your account credentials secure. We accept no
                liability for losses arising from unauthorised use of your account.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
              8. Fraud &amp; Misuse
            </h2>
            <p>
              Any attempt to manipulate, duplicate, or fraudulently obtain Chicken Heads or
              rewards will result in immediate account cancellation and may be referred to the
              relevant authorities. We reserve the right to suspend or cancel accounts at our
              discretion if we suspect misuse.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
              9. Changes to the Programme
            </h2>
            <p>
              We may amend, suspend, or withdraw the Programme or these terms at any time. We will
              provide reasonable notice of material changes via our website. Continued use of the
              Programme following any changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
              10. Privacy &amp; Data
            </h2>
            <p>
              We process your personal data in accordance with our{" "}
              <Link href="/privacy" className="text-[#d4a838] hover:underline">
                Privacy Policy
              </Link>{" "}
              and applicable data protection law (UK GDPR). We will not sell your data to third
              parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
              11. Governing Law
            </h2>
            <p>
              These terms are governed by the laws of England and Wales. Any disputes shall be
              subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section className="pt-8 border-t border-white/10">
            <p className="text-white/70">
              Questions about your rewards? Visit{" "}
              <a
                href="https://peckerschicken.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d4a838] hover:underline"
              >
                peckerschicken.co.uk
              </a>{" "}
              or speak to a team member in-store at our Hitchin or Stevenage locations.
            </p>
            <p className="text-sm font-mono opacity-60 mt-4">
              © 2023 Peckers Chicken Ltd. All rights reserved.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
