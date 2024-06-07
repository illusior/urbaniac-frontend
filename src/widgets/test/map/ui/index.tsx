interface TestMapProps {
  mapName: string;
}

export const TestMap: React.FC<TestMapProps> = ({ mapName }: TestMapProps): JSX.Element => {
  return (
    <>
      {mapName}
    </>
  );
};
