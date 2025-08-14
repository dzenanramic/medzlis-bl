"use client";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Props = {
  images: string[];
};

export default function AdditionalPhotos({ images }: Props) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer"
            onClick={() => setSelectedImg(img)}
          >
            <Image
              src={img}
              alt={`Additional photo ${idx + 1}`}
              fill
              className="object-cover transform transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {selectedImg && (
        <Dialog open={!!selectedImg} onOpenChange={() => setSelectedImg(null)}>
          <DialogContent className="sm:max-h-[425px] p-0">
            <DialogTitle></DialogTitle>
            <Image
              src={selectedImg}
              alt="Preview"
              width={1200}
              height={900}
              className="object-contain rounded-lg max-w-full max-h-[90vh]"
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
