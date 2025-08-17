import { notFound } from 'next/navigation';

type CatchAllProps = {
  params: Promise<{
    locale: string;
    rest: string[];
  }>;
};

export default async function CatchAllPage(props: CatchAllProps) {
  const params = await props.params;
  const path = params.rest?.join('/') || '';

  if (path === 'about' || path.startsWith('page/')) {
    return notFound();
  }

  return notFound();
}
