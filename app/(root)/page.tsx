/* eslint-disable */

import { Button } from "@/components/ui/common/shadcn/button";

interface RootPageProps {
  prop: string;
}

const RootPage = ({
  prop,
}: RootPageProps) => {
  console.log();
  return (
    <div>
      <Button>
        aaa
      </Button>
    </div>
  );
}

export default RootPage;
