import { redirect } from "next/navigation";

const Guard = () => {
  return redirect("/docs/getting-started");
};

export default Guard;
