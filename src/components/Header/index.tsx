import Link from 'next/link';
import Image from 'next/image';

import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.container}>
      <Link href="/" passHref>
        <a>
          <Image
            src="/images/logo.svg"
            width="230px"
            height="25px"
            alt="logo"
          />
        </a>
      </Link>
    </header>
  );
}
