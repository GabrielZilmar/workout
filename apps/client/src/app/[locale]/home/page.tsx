import { WorkoutDataTable } from "~/components/data-table/workouts";
import GlobalLayout from "~/layouts/global.layout";

const Home: React.FC = () => {
  return (
    <GlobalLayout>
      <WorkoutDataTable />
    </GlobalLayout>
  );
};

export default Home;
