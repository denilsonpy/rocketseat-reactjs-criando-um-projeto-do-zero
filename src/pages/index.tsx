import Head from 'next/head';
import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../services/prismic';
import * as prismic from '@prismicio/client';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>([] as Post[]);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const formatedPosts = postsPagination?.results?.map(post => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          'dd LLL yyyy',
          {
            locale: ptBR,
          }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setPosts(formatedPosts);
  }, []);

  async function handleNextPage(): Promise<void> {
    if (currentPage !== 1 || nextPage === null) return;

    const postResults = await fetch(`${nextPage}`).then(response =>
      response.json()
    );

    setNextPage(postResults.next_page);
    setCurrentPage(postResults.page);

    const newPosts = postResults?.results?.map(post => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          'dd LLL yyyy',
          {
            locale: ptBR,
          }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setPosts([...posts, ...newPosts]);
  }

  return (
    <>
      <Head>
        <title>Test | SpaceTraveling</title>
      </Head>
      <Header />
      <div className={commonStyles.container}>
        <main>
          {posts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`} passHref>
              <a className={styles.post}>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <div className={styles.details}>
                  <div>
                    <FiCalendar />
                    <time>{post.first_publication_date}</time>
                  </div>

                  <div>
                    <FiUser />
                    <p>{post.data.author}</p>
                  </div>
                </div>
              </a>
            </Link>
          ))}

          {nextPage !== null && (
            <button className={styles.loadMoreButton} onClick={handleNextPage}>
              Carregar mais posts
            </button>
          )}
        </main>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismicClient = getPrismicClient({});

  const postsPesponse = await prismicClient.getByType('custom-post', {
    pageSize: 1,
  });

  return {
    props: {
      postsPagination: {
        results: postsPesponse.results,
        next_page: postsPesponse.next_page,
      },
    },
    revalidate: 60,
  };
};
