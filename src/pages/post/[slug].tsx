import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import styles from './post.module.scss';
import commonStyles from '../../styles/common.module.scss';
import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  return (
    <>
      <Head>
        <title>{post.data.title} | SpaceTraveling</title>
      </Head>
      <Header />
      <main className={styles.container}>
        <img src={post.data.banner.url} alt="banner" />
        <article className={styles.post}>
          <h1>{post.data.title}</h1>
          <div className={styles.details}>
            <div>
              <FiCalendar />
              <time>{post.first_publication_date}</time>
            </div>

            <div>
              <FiUser />
              <p>{post.data.author}</p>
            </div>

            <div>
              <FiClock />
              <time>4 min</time>
            </div>
          </div>

          <div className={styles.postHeader}>
            <h2>Proin et varius</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              dolor sapien, vulputate eu diam at, condimentum hendrerit tellus.
              Nam facilisis sodales felis, pharetra pharetra lectus auctor sed.
              Ut venenatis mauris vel libero pretium, et pretium ligula
              faucibus. Morbi nibh felis, elementum a posuere et, vulputate et
              erat. Nam venenatis.
            </p>
          </div>

          <div className={styles.postContent}>
            <h2>Cras laoreet mi</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              dolor sapien, vulputate eu diam at, condimentum hendrerit tellus.
              Nam facilisis sodales felis, pharetra pharetra lectus auctor sed.
              Ut venenatis mauris vel libero pretium, et pretium ligula
              faucibus. Morbi nibh felis, elementum a posuere et, vulputate et
              erat. Nam venenatis.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              dolor sapien, vulputate eu diam at, condimentum hendrerit tellus.
              Nam facilisis sodales felis, pharetra pharetra lectus auctor sed.
              Ut venenatis mauris vel libero pretium, et pretium ligula
              faucibus. Morbi nibh felis, elementum a posuere et, vulputate et
              erat. Nam venenatis.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              dolor sapien, vulputate eu diam at, condimentum hendrerit tellus.
              Nam facilisis sodales felis, pharetra pharetra lectus auctor sed.
              Ut venenatis mauris vel libero pretium, et pretium ligula
              faucibus. Morbi nibh felis, elementum a posuere et, vulputate et
              erat. Nam venenatis.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              dolor sapien, vulputate eu diam at, condimentum hendrerit tellus.
              Nam facilisis sodales felis, pharetra pharetra lectus auctor sed.
              Ut venenatis mauris vel libero pretium, et pretium ligula
              faucibus. Morbi nibh felis, elementum a posuere et, vulputate et
              erat. Nam venenatis.
            </p>
          </div>
        </article>
      </main>
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
  console.log(postResponse.data.body);
  const post = {
    first_publication_date: format(
      new Date(postResponse.first_publication_date),
      'dd LLL yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: postResponse.data.title,
      subtitle: postResponse.data.subtitle,
      banner: {
        url: postResponse.data.banner.url,
      },
      author: postResponse.data.author,
      content: postResponse.data.body,
    },
  };

  console.log(post);

  return {
    props: {
      post,
    },
  };
};
