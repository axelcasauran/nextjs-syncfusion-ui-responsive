'use client';

import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative container max-w-none items-center lg:items-stretch justify-center flex lg:grid lg:flex-col lg:grid-cols-2 lg:px-0">
      <div className="flex flex-col items-center justify-center w-full p-10 order-2 lg:order-1">
        <div className="flex items-center justify-center lg:hidden pt-0 pb-0">
          {/* <Link href="/">
            <Image
              src={
                theme === 'dark'
                  ? '/brand/logo-full-dark.svg'
                  : '/brand/logo-full-light.svg'
              }
              height={0}
              width={150}
              alt=""
            />
          </Link> */}
          <p className="text-2xl font-semibold tracking-tight text-center pb-1">
            Victory Dasmariñas
          </p>
        </div>
        <div className="flex items-center grow w-full max-w-[375px]">
          {children}
        </div>
        <p className="text-sm text-muted-foreground text-center pt-10 lg:pt-5">
          {currentYear} &copy; Victory Dasmariñas - Kids Church.
        </p>
      </div>

      <div
        className="hidden lg:flex flex-col justify-between lg:rounded-xl lg:border lg:border-light lg:m-5 order-1 lg:order-2 bg-top xxl:bg-center xl:bg-cover bg-no-repeat branded-bg gap-y-8"
        style={{
          backgroundImage: `url('/media/app/auth-bg.png')`,
          // backgroundColor: `#1451f5`
        }}
      >
        <div className="flex flex-col items-center justify-center text-center grow gap-5 lg:gap-14">
          {/* <Link href="/">
            <Image
              src="/brand/logo-full-dark.svg"
              height={0}
              width={150}
              alt=""
            />
          </Link> */}

          <div className="flex flex-col items-center justify-center gap-2.5">
            <h3 className="text-3xl font-semibold text-white/90">
            Church Sample
            </h3>
            <div className="text-md font-normal text-white/50">
            We partner with the parents to train and equip 
              <br />
              the next generation leaders!
            </div>
          </div>

          <div className="place-self-center mx-4 xxl:mx-0">
            <img
              src="/media/app/auth-screen.png"
              className="max-w-[230px] w-full h-auto hidden lg:block"
              alt=""
            />
          </div>
        </div>

        
      </div>
    </div>
  );
}
