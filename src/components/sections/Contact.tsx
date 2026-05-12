import { useState } from "react";
import { SectionHeader } from "./SectionHeader";

const SOCIALS = [
  { label: "GitHub", url: "https://github.com/sriharish00u" },
  { label: "LinkedIn", url: "#" },
  { label: "Email", url: "mailto:arishexim011@gmail.com" },
];

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = () => {
    if (!name || !message) return;
    const waText = encodeURIComponent(
      `Hi Jay, I'm ${name}.\n\n${message}\n\nReply to: ${email}`,
    );
    const mailBody = encodeURIComponent(`${message}\n\nFrom: ${name}`);
    window.open(`https://wa.me/?text=${waText}`, "_blank");
    window.open(
      `mailto:arishexim011@gmail.com?subject=Portfolio Inquiry from ${encodeURIComponent(name)}&body=${mailBody}`,
      "_blank",
    );
  };

  const Field = ({
    label,
    value,
    onChange,
    type = "text",
    textarea = false,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    textarea?: boolean;
  }) => (
    <div className="mb-8 group">
      <label className="block text-[11px] text-[#F59E0B] tracking-[0.2em] uppercase mb-2">
        {label}
      </label>
      <div
        className="border-b border-[#F5F0E8]/15 pb-1 transition-colors focus-within:border-[#F59E0B]"
      >
        {textarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="bg-transparent outline-none text-[#F5F0E8] text-base w-full resize-none min-h-[100px] font-sans"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-transparent outline-none text-[#F5F0E8] text-base w-full font-sans"
          />
        )}
      </div>
    </div>
  );

  return (
    <section
      data-section="contact"
      className="min-h-[80vh] py-24 px-5 md:px-[80px]"
    >
      <div className="reveal mb-14">
        <SectionHeader number="05" title="Contact." />
      </div>

      <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
        <div className="reveal" style={{ "--i": 1 } as React.CSSProperties}>
          <Field label="Your Name" value={name} onChange={setName} />
          <Field label="Email" value={email} onChange={setEmail} type="email" />
          <Field label="Message" value={message} onChange={setMessage} textarea />
          <button
            onClick={submit}
            className="w-full bg-[#F59E0B] text-[#0A0A0A] font-bold py-3.5 rounded-sm text-[15px] hover:bg-[#D97706] transition-colors mt-2"
          >
            Send Message
          </button>
        </div>

        <div className="reveal" style={{ "--i": 2 } as React.CSSProperties}>
          <h3
            className="font-serif text-[#F5F0E8] mb-12"
            style={{ fontSize: "clamp(28px, 4vw, 40px)" }}
          >
            Let's connect.
          </h3>
          <div className="flex flex-col gap-8">
            {SOCIALS.map((s) => (
              <button
                key={s.label}
                onClick={() => window.open(s.url, "_blank")}
                className="flex items-center justify-between pb-5 border-b border-[#F5F0E8]/10 group text-left"
              >
                <span className="social-link font-serif text-[#F5F0E8]" style={{ fontSize: "clamp(22px, 3vw, 32px)" }}>
                  {s.label}
                </span>
                <span className="text-[#F59E0B] text-xl group-hover:translate-x-1 transition-transform">↗</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-[#F5F0E8]/35 mt-10">
            Based in Coimbatore, Tamil Nadu, India
          </p>
        </div>
      </div>
    </section>
  );
}
