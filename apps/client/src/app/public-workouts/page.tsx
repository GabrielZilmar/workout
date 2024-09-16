import { PublicWorkoutsDataTable } from "~/components/data-table/public-workouts";
import GlobalLayout from "~/layouts/global.layout";

const PublicWorkoutsPage: React.FC = () => {
  return (
    <GlobalLayout>
      <PublicWorkoutsDataTable />
    </GlobalLayout>
  );
};

export default PublicWorkoutsPage;
