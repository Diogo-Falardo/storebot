import Navbar from "@/components/navbar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <div className="flex justify-center w-full">
        <div className="flex w-full max-w-5xl">{children}</div>
      </div>
    </div>
  );
};

export default layout;
