import fetch from 'node-fetch';
import * as prismic from '@prismicio/client';
import { HttpRequestLike } from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';

export interface PrismicConfig {
  req?: HttpRequestLike;
}

export function getPrismicClient(config: PrismicConfig): prismic.Client {
  const repoName = 'blog-projeto-zero';
  const endpoint = prismic.getEndpoint(repoName);
  const client = prismic.createClient(endpoint, {
    fetch,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  enableAutoPreviews({
    client,
    req: config.req,
  });

  return client;
}
