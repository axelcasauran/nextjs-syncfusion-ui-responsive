// import { GENERAL_LINKS_CONFIG } from '@/config/common';
import { Container } from '@/app/components/common/container';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  // const links = GENERAL_LINKS_CONFIG;

  return (
    <footer className="mt-auto bg-background border-t">
      <Container>
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 py-2 text-sm">
          <div className="flex order-2 md:order-1  gap-2 font-normal text-sm">
            <span className="text-muted-foreground">{currentYear} &copy;</span>
            <a
              href=""
              target="_blank"
              className="text-muted-foreground hover:text-primary"
            >
              Prototype - Kids Church
            </a>
          </div>
          {/* <nav className="flex order-1 md:order-2 gap-4 font-normal text-sm text-muted-foreground">
            <a
              href={links.purchaseLink}
              target="_blank"
              className="hover:text-primary"
            >
              Purchase
            </a>
            <a
              href={links.faqLink}
              target="_blank"
              className="hover:text-primary"
            >
              FAQ
            </a>
          </nav> */}
        </div>
      </Container>
    </footer>
  );
};

export { Footer };
