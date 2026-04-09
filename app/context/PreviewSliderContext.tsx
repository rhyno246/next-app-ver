"use client";
import React, { createContext, useContext, useState } from "react";

interface PreviewSliderType {
  isModalPreviewOpen: boolean;
  images: string[];
  currentIndex: number;
  openPreviewModal: (images: string[], index: number) => void;
  closePreviewModal: () => void;
  setCurrentIndex: (index: number) => void;
}

const PreviewSlider = createContext<PreviewSliderType | undefined>(undefined);

export const usePreviewSlider = () => {
  const context = useContext(PreviewSlider);
  if (!context) {
    throw new Error("usePreviewSlider must be used within a ModalProvider");
  }
  return context;
};

export const PreviewSliderProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [isModalPreviewOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openPreviewModal = (imgs: string[], index: number) => {
    setImages(imgs);
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsModalOpen(false);
    setImages([]);
    setCurrentIndex(0);
  };

  return (
    <PreviewSlider.Provider
      value={{
        isModalPreviewOpen,
        images,
        currentIndex,
        openPreviewModal,
        closePreviewModal,
        setCurrentIndex,
      }}
    >
      {children}
    </PreviewSlider.Provider>
  );
};
