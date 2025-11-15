import type { Metadata } from "next";
import { examplesData } from "../data";

const example = examplesData.login;

export const metadata: Metadata = {
  title: example.title,
  description: example.description,
  keywords: example.tags,
};

export default metadata;
