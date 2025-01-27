/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useMemo } from 'react';

import AutoScroll from 'embla-carousel-auto-scroll';
import { Globe } from 'lucide-react';
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

const Acknowledgements = () => {
  const logos = useMemo(
    () => [
      {
        name: 'Bash',
        src: '/svg/bash_dark.svg',
      },
      {
        name: 'Claude',
        src: '/svg/claude-ai-wordmark-icon_dark.svg',
      },
      {
        name: 'CSS3',
        src: '/svg/css_old.svg',
      },
      {
        name: 'dotenv',
        src: '/svg/dotenv.svg',
      },
      {
        name: 'Google',
        src: '/svg/google-wordmark.svg',
      },
      {
        name: 'HTML5',
        src: '/svg/html5.svg',
      },
      {
        name: 'JavaScript',
        src: '/svg/javascript.svg',
      },
      {
        name: 'Linux',
        src: '/svg/linux.svg',
      },
      {
        name: 'Neon',
        src: '/svg/neon.svg',
      },
      {
        name: 'Next.js',
        src: '/svg/nextjs_logo_dark.svg',
      },
      {
        name: 'Node.js',
        src: '/svg/nodejs.svg',
      },
      {
        name: 'OpenAI',
        src: '/svg/openai_wordmark_dark.svg',
      },
      {
        name: 'PostCSS',
        src: '/svg/postcss_wordmark.svg',
      },
      {
        name: 'PostgreSQL',
        src: '/svg/postgresql.svg',
      },
      {
        name: 'Prettier',
        src: '/svg/prettier-icon-dark.svg',
      },
      {
        name: 'Prisma',
        src: '/svg/prisma_dark.svg',
      },
      {
        name: 'Radix UI',
        src: '/svg/radix-ui_dark.svg',
      },
      {
        name: 'React',
        src: '/svg/react_wordmark_dark.svg',
      },
      {
        name: 'React Query',
        src: '/svg/reactquery.svg',
      },
      {
        name: 'Shadcn/UI',
        src: '/svg/shadcn-ui_dark.svg',
      },
      {
        name: 'Stack Overflow',
        src: '/svg/stackoverflow.svg',
      },
      {
        name: 'Stripe',
        src: '/svg/stripe.svg',
      },
      {
        name: 'Tailwind CSS',
        src: '/svg/tailwindcss.svg',
      },
      {
        name: 'Turborepo',
        src: '/svg/turborepo.svg',
      },
      {
        name: 'TypeScript',
        src: '/svg/typescript.svg',
      },
      {
        name: 'Ubuntu',
        src: '/svg/ubuntu.svg',
      },
      {
        name: 'Vercel',
        src: '/svg/vercel_wordmark_dark.svg',
      },
      {
        name: 'Zod',
        src: '/svg/zod.svg',
      },
    ],
    []
  );

  const socials = useMemo(
    () => [
      {
        href: 'https://linkedin.com/in/bkschatzki',
        image: (
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 256"
          >
            <path
              d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453"
              fill="#0A66C2"
            />
          </svg>
        ),
        name: 'LinkedIn',
      },
      {
        href: 'https://github.com/bkschatzki',
        image: (
          <svg
            viewBox="0 0 256 250"
            width="24"
            height="24"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
          >
            <path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Zm-80.06 182.34c-.282.636-1.283.827-2.194.39-.929-.417-1.45-1.284-1.15-1.922.276-.655 1.279-.838 2.205-.399.93.418 1.46 1.293 1.139 1.931Zm6.296 5.618c-.61.566-1.804.303-2.614-.591-.837-.892-.994-2.086-.375-2.66.63-.566 1.787-.301 2.626.591.838.903 1 2.088.363 2.66Zm4.32 7.188c-.785.545-2.067.034-2.86-1.104-.784-1.138-.784-2.503.017-3.05.795-.547 2.058-.055 2.861 1.075.782 1.157.782 2.522-.019 3.08Zm7.304 8.325c-.701.774-2.196.566-3.29-.49-1.119-1.032-1.43-2.496-.726-3.27.71-.776 2.213-.558 3.315.49 1.11 1.03 1.45 2.505.701 3.27Zm9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033-1.448-.439-2.395-1.613-2.103-2.626.301-1.01 1.747-1.484 3.207-1.028 1.446.436 2.396 1.602 2.095 2.622Zm10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95-1.53.034-2.769-.82-2.786-1.86 0-1.065 1.202-1.932 2.733-1.958 1.522-.03 2.768.818 2.768 1.868Zm10.555-.405c.182 1.03-.875 2.088-2.387 2.37-1.485.271-2.861-.365-3.05-1.386-.184-1.056.893-2.114 2.376-2.387 1.514-.263 2.868.356 3.061 1.403Z" />
          </svg>
        ),
        name: 'GitHub',
      },
      {
        href: 'https://www.bkschatzki.dev',
        image: <Globe className={cn(`size-6`)} />,
        name: 'Personal Site',
      },
      {
        href: 'https://bsky.app/profile/bkschatzki.bsky.social',
        image: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 226"
          >
            <path
              fill="#1185FE"
              d="M55.491 15.172c29.35 22.035 60.917 66.712 72.509 90.686 11.592-23.974 43.159-68.651 72.509-90.686C221.686-.727 256-13.028 256 26.116c0 7.818-4.482 65.674-7.111 75.068-9.138 32.654-42.436 40.983-72.057 35.942 51.775 8.812 64.946 38 36.501 67.187-54.021 55.433-77.644-13.908-83.696-31.676-1.11-3.257-1.63-4.78-1.637-3.485-.008-1.296-.527.228-1.637 3.485-6.052 17.768-29.675 87.11-83.696 31.676-28.445-29.187-15.274-58.375 36.5-67.187-29.62 5.041-62.918-3.288-72.056-35.942C4.482 91.79 0 33.934 0 26.116 0-13.028 34.314-.727 55.491 15.172Z"
            />
          </svg>
        ),
        name: 'Bluesky',
      },
      {
        href: 'https://www.buymeacoffee.com/bkschatzki',
        image: (
          <img
            src={`https://cdn.buymeacoffee.com/buttons/v2/default-red.png`}
            alt={`Buy Me a Coffee Link`}
            className={cn(`h-6`)}
          />
        ),
        name: 'Buy My a Coffee',
      },
    ],
    []
  );

  return (
    <footer className={cn(``)}>
      <div
        className={cn(
          `flex flex-col items-center border-t-2 border-[#302a2a] bg-base-300 p-4 sm:px-16`
        )}
      >
        <div
          className={cn(`flex w-full items-center justify-between gap-8 max-lg:flex-col-reverse`)}
        >
          <div className={cn(`flex flex-col gap-2`)}>
            <p>
              Credit must be given to the{' '}
              <Link
                href={`https://www.youtube.com/watch?v=Sd2svbU7t50`}
                target={`_blank`}
                rel={`noreferrer noopener`}
                className={cn(
                  `text-warning underline decoration-2 hover:brightness-125 focus:brightness-125`
                )}
              >
                original video
              </Link>{' '}
              and{' '}
              <Link
                href={`https://diyanddragons.blogspot.com/2019/10/landmark-hidden-secret.html`}
                target={`_blank`}
                rel={`noreferrer noopener`}
                className={cn(
                  `text-warning underline decoration-2 hover:brightness-125 focus:brightness-125`
                )}
              >
                blogpost
              </Link>{' '}
              that brought the three-layered framework into the spotlight and inspired the
              development of this application.
            </p>
            <p className={cn(`text-sm text-base-content/50`)}>
              Acknowledgements are needed for the tools found below; without them, this application
              wouldn't have been possible. Or rather, it would have been possible, but much more
              annoying to build.
            </p>
          </div>
          <div className={cn(`flex shrink-0 flex-col items-center gap-4`)}>
            <ul className={cn(`flex gap-4`)}>
              {socials.map((social) => (
                <li key={social.name}>
                  <Link
                    href={social.href}
                    target={`_blank`}
                    rel={`noreferrer noopener`}
                  >
                    {social.image}
                    <span className={cn(`sr-only`)}>{social.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className={cn(`text-balance text-center text-xs text-base-content/50`)}>
              To learn more about the developer, visit the links above.
            </p>
          </div>
        </div>
      </div>
      <Carousel
        opts={{
          dragFree: true,
          loop: true,
          skipSnaps: true,
        }}
        plugins={[AutoScroll({ startDelay: 0, speed: 1, stopOnInteraction: false })]}
        className={cn(`border-y-2 border-[#302a2a] py-0.5`)}
      >
        <CarouselContent>
          {logos.map((logo) => (
            <CarouselItem
              key={logo.name}
              className={cn(
                `flex min-w-0 basis-1/3 items-center justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6`
              )}
            >
              <Card className={cn(`bg-base-100 basis-full rounded-2xl border-l-2 py-4`)}>
                <img
                  src={logo.src}
                  alt={`${logo.name} Logo`}
                  className={cn(`h-6`)}
                />
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </footer>
  );
};

export default Acknowledgements;
