import { useParams } from '@solidjs/router';
import { PageFrame, Content } from '../components/visual';

export function AdminPage() {
  const params = useParams<{ username: string }>();

  return (
    <PageFrame>
      <Content>
        <div class="max-w-3xl mx-auto">
          <h1 class="text-2xl font-semibold text-[#3d2e0a]">
            Admin {params.username}
          </h1>
        </div>
      </Content>
    </PageFrame>
  );
}

