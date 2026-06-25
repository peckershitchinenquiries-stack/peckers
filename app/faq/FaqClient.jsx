"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { faqData } from "./faqData";
import { FiPlus, FiMinus, FiSearch } from "react-icons/fi";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FaqItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="w-full border-b border-[#262626] py-5 sm:py-7">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-start text-left gap-4 group"
        aria-expanded={isOpen}
      >
        <h3
          className="text-[5vw] sm:text-[3.5vw] md:text-[2.2vw] lg:text-[1.8vw] xl:text-[1.4vw] leading-snug text-white transition-colors group-hover:text-[#C41718]"
          style={{
            fontFamily: "var(--font-peakers-bold)",
            letterSpacing: "0.02em",
            textTransform: "uppercase"
          }}
        >
          {question}
        </h3>
        <div className="mt-1 flex-shrink-0">
          {isOpen ? (
            <FiMinus className="text-[#C41718] w-6 h-6 sm:w-8 sm:h-8" />
          ) : (
            <FiPlus className="text-[#E3E3E3] w-6 h-6 sm:w-8 sm:h-8 transition-colors group-hover:text-white" />
          )}
        </div>
      </button>

      <div
        className="faq-collapse"
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 350ms cubic-bezier(0.22, 1, 0.36, 1)",
          WebkitTransform: "translateZ(0)",
          transform: "translateZ(0)",
        }}
      >
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          <div
            className="text-[#B7BAC8] text-[4vw] sm:text-[2.8vw] md:text-[1.8vw] lg:text-[1.3vw] xl:text-[1.1vw] leading-relaxed max-w-[95%] pt-5"
            style={{ fontFamily: "var(--font-neuzeit)" }}
          >
            {answer.split(/(\[.*?\]\(.*?\))/g).map((part, index) => {
              const match = part.match(/\[(.*?)\]\((.*?)\)/);
              if (match) {
                const isExternal = match[2].startsWith('http');
                return (
                  <Link
                    key={index}
                    href={match[2]}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="text-[#C41718] hover:underline transition-all duration-300"
                  >
                    {match[1]}
                  </Link>
                );
              }
              return part.split('\n').map((line, i) => (
                <React.Fragment key={`${index}-${i}`}>
                  {line}
                  {i !== part.split('\n').length - 1 && <br />}
                </React.Fragment>
              ));
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FaqClient() {
  const [openIds, setOpenIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleId = (id) => {
    setOpenIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  // Update ScrollTrigger/Lenis on expansion
  React.useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const timers = [
      setTimeout(refresh, 100),
      setTimeout(refresh, 300),
      setTimeout(refresh, 600)
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [openIds]);

  const filteredData = faqData.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="px-4 md:px-[2vw] lg:px-[2.5vw] xl:px-[2.8vw]">
        {/* Header Section */}
        <section className="mb-[8vw] md:mb-[8vw] lg:mb-[6vw] max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[6vw] xl:text-[5.5vw] leading-[0.9] text-white uppercase mb-6"
            style={{ fontFamily: "var(--font-peakers-bold)" }}
          >
            Frequently <br />
            <span className="text-[#C41718]">Asked</span> Questions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#B7BAC8] text-[4.5vw] sm:text-[3vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.2vw] max-w-2xl leading-relaxed"
            style={{ fontFamily: "var(--font-neuzeit)" }}
          >
            Everything you need to know about Peckers. From our fresh ingredients to our Seriously Good Chicken.
          </motion.p>
        </section>

        {/* Search Bar */}
        <section className="mb-[8vw] md:mb-[8vw] lg:mb-[6vw]">
          <div className="relative max-w-2xl group">
            <FiSearch className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-[#586676] w-5 h-5 sm:w-6 sm:h-6 transition-colors group-focus-within:text-[#C41718]" />
            <input
              type="text"
              name="search"
              placeholder="Search for a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111] border border-[#262626] rounded-2xl py-4 sm:py-5 pl-13 sm:pl-16 pr-5 sm:pr-6 text-white text-[4vw] sm:text-[2.5vw] md:text-[1.8vw] lg:text-[1.3vw] xl:text-[1.1vw] focus:outline-none focus:border-[#C41718] transition-all"
              style={{ fontFamily: "var(--font-neuzeit)" }}
            />
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="space-y-[8vw] md:space-y-[8vw]">
          {filteredData.length > 0 ? (
            filteredData.map((category, catIdx) => (
              <div key={catIdx} className="relative">
                <div className="sticky top-0 bg-black/90 backdrop-blur-sm pt-3 pb-3 sm:pt-4 sm:pb-5 z-10 border-b border-[#C41718]/20 mb-2 sm:mb-4 font-bold">
                  <h2
                    className="text-[7vw] sm:text-[5vw] md:text-[3.5vw] lg:text-[2.5vw] xl:text-[2vw] text-[#C41718] uppercase"
                    style={{ fontFamily: "var(--font-peakers-bold)" }}
                  >
                    {category.category}
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-x-12 items-start">
                   <div className="hidden lg:block">
                      <p className="text-[#586676] font-mono text-[0.9vw] uppercase tracking-widest leading-relaxed">
                        Questions related to <br /> {category.category}
                      </p>
                   </div>
                   <div className="flex flex-col items-stretch w-full">
                    {category.items.map((item) => (
                      <FaqItem
                        key={item.id}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openIds.includes(item.id)}
                        onClick={() => toggleId(item.id)}
                      />
                    ))}
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-[#586676] text-[5vw] sm:text-[3vw] md:text-[2vw]" style={{ fontFamily: "var(--font-neuzeit)" }}>
                No questions found matching your search.
              </p>
            </div>
          )}
        </section>

        {/* Contact CTA */}
        <section className="mt-[10vw] md:mt-[6vw] bg-[#111] border border-[#262626] rounded-[4vw] md:rounded-[2vw] p-[8vw] md:p-[6vw] lg:p-[4vw] text-center">
            <h2 
              className="text-[8vw] sm:text-[6vw] md:text-[4vw] lg:text-[3vw] xl:text-[2.5vw] text-white uppercase mb-6"
              style={{ fontFamily: "var(--font-peakers-bold)" }}
            >
              Still have <span className="text-[#C41718]">Questions?</span>
            </h2>
            <p 
              className="text-[#B7BAC8] text-[4.5vw] sm:text-[3vw] md:text-[1.8vw] lg:text-[1.3vw] xl:text-[1.1vw] mb-10 max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-neuzeit)" }}
            >
              If you can't find what you're looking for, feel free to give us a call or visit one of our locations. We're always happy to help!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <a 
                  href="tel:07879512344"
                  className="bg-[#C41718] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wide hover:bg-[#a31314] transition-colors"
                  style={{ fontFamily: "var(--font-peakers-bold)" }}
                >
                  Stevenage: 07448 318855
                </a>
                <a 
                  href="tel:07599828199"
                  className="border border-[#262626] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wide hover:bg-[#161616] transition-colors"
                  style={{ fontFamily: "var(--font-peakers-bold)" }}
                >
                  Hitchin: 07599 828199
                </a>
            </div>
        </section>
      </div>
  );
}
