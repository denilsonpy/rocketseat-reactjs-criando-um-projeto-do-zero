import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import PrismicDom from 'prismic-dom';

import styles from './post.module.scss';
import commonStyles from '../../styles/common.module.scss';
import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { route } from 'next/dist/next-server/server/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  const readingTime = Math.ceil(
    post.data.content.reduce((total, currentItem) => {
      const mappedHeadingWords = currentItem.heading.split(/ /g).length;

      const mappedBodyWord = currentItem.body
        .map(item => item.text.split(/ /g).length)
        .reduce((total, currentItem) => (total += currentItem));

      total += mappedHeadingWords + mappedBodyWord;

      return total;
    }, 0) / 200
  );

  const first_publication_date = format(
    new Date(post.first_publication_date),
    'dd LLL yyyy',
    {
      locale: ptBR,
    }
  );

  return (
    <>
      <Head>
        <title>{post.data.title} | SpaceTraveling</title>
      </Head>
      <Header />
      {!post ? (
        'Carregando...'
      ) : (
        <main className={styles.container}>
          <img src={post.data.banner.url} alt="banner" />
          <article className={styles.post}>
            <h1>{post.data.title}</h1>
            <div className={styles.details}>
              <div>
                <FiCalendar />
                <time>{first_publication_date}</time>
              </div>

              <div>
                <FiUser />
                <p>{post.data.author}</p>
              </div>

              <div>
                <FiClock />
                <time>{readingTime} min</time>
              </div>
            </div>

            {post.data.content.map((content, index) => (
              <article key={index}>
                <h2>{content.heading}</h2>
                <div
                  className={styles.post}
                  dangerouslySetInnerHTML={{
                    __html: PrismicDom.RichText.asHtml(content.body),
                  }}
                />
              </article>
            ))}
          </article>
        </main>
      )}
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('custom-post', {
    pageSize: 6,
  });

  return {
    // @ts-ignore
    paths: posts.results.map(post => ({ params: { slug: post.uid } })),
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient({});
  const postResponse = await prismic.getByUID('custom-post', String(slug), {});

  const post = {
    uid: postResponse.uid,
    first_publication_date: postResponse.first_publication_date,
    title: postResponse.data.title,
    data: {
      title: postResponse.data.title,
      subtitle: postResponse.data.subtitle,
      author: postResponse.data.author,
      banner: {
        url: postResponse.data.banner.url,
      },
      content: postResponse.data.content.map(content => ({
        heading: content.heading,
        body: [...content.body],
      })),
    },
  };

  return {
    props: {
      post,
    },
  };
};
