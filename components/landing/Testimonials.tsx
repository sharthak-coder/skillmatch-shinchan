'use client';

import React from 'react';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Toru Kazama',
    role: 'Senior, AI & Applied Math',
    school: 'Tokyo Institute of Tech',
    text: 'I used to build entire ML pipelines alone because people in classes lacked PyTorch fundamentals. With SkillMatch, I matched with a frontend wizard in 10 minutes and won the Stanford TreeHacks 1st prize.',
    avatar: '/avatars/kazama.svg',
    stat: '1st Place Hackathon',
  },
  {
    name: 'Nene Sakurada',
    role: 'Junior, HCI & Product Design',
    school: 'Carnegie Mellon University',
    text: 'Engineering students always undervalued micro-interactions and user research. Here, the weighted overlap algorithm highlighted how my Figma and design systems complemented backend engineers perfectly!',
    avatar: '/avatars/nene.svg',
    stat: '3 Shipped Startups',
  },
  {
    name: 'Masao Sato',
    role: 'Junior, DevOps & Cloud Systems',
    school: 'University of Waterloo',
    text: 'I was nervous about reaching out to senior builders. The Action Kamen SyncChain showed I had an 88% skill match for a Web3 project, gave me confidence to send a request, and we had zero downtime on launch day.',
    avatar: '/avatars/masao.svg',
    stat: '99.99% Uptime Project',
  },
];

export default function Testimonials() {
  return (
    <section className="py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-shin-yellow text-shin-ink border-2 border-shin-ink shadow-pop-sm inline-block mb-3">
          ⭐ Hall of Kasukabe Legends
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-shin-ink tracking-tight">
          Teammates Who Shipped Magic Together.
        </h2>
        <p className="text-xs sm:text-sm text-shin-ink/70 font-semibold mt-2">
          From late-night pizza hackathons to venture-backed capstone projects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="card-pop p-6 bg-white flex flex-col justify-between hover:-translate-y-1 transition-transform"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-shin-canvas border border-shin-ink text-shin-ink">
                  {t.stat}
                </span>
              </div>

              <p className="text-xs text-shin-ink/80 leading-relaxed font-medium mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t-2 border-shin-ink/10">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-11 h-11 rounded-2xl border-2 border-shin-ink object-contain p-0.5 bg-shin-canvas shadow-pop-sm"
              />
              <div>
                <h4 className="text-xs font-black text-shin-ink">{t.name}</h4>
                <p className="text-[11px] font-semibold text-shin-ink/60">{t.role}</p>
                <p className="text-[10px] font-bold text-shin-blue">{t.school}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
