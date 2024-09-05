import RootLayout from "@/components/layout/RootLayout";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex">
        <RootLayout>
          <div className="p-4 lg:p-10">{children}</div>
        </RootLayout>
      </div>
    </>
  );
};

export default MainLayout;
