import Image from "next/image";

type Feature = {
  title: string;
  description: string;
};

type Props = {
  heading: string;
  features: Feature[];
  image: { src: string; width: number; height: number; alt: string };
  imagePosition: "left" | "right";
  activeFeatureIndex?: number;
};

export function FeatureShowcase({
  heading,
  features,
  image,
  imagePosition,
  activeFeatureIndex = 0,
}: Props) {
  const imageBlock = (
    <div className="flex items-center justify-center rounded-2xl bg-surface-muted p-8">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="w-full max-w-md"
      />
    </div>
  );

  const textBlock = (
    <div>
      <h2 className="mb-8 text-3xl font-bold text-text-primary">{heading}</h2>
      <div className="flex flex-col">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={`border-l-2 py-5 pl-6 ${
              index === activeFeatureIndex
                ? "border-accent"
                : "border-border"
            }`}
          >
            <h3 className="text-base font-semibold text-text-primary">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="px-8 py-16">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 md:grid-cols-2">
        {imagePosition === "left" ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </div>
    </section>
  );
}
