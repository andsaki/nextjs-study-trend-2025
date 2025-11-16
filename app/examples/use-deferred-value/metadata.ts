import type { Metadata } from "next";
import { examplesData } from "../data";

const example = examplesData["use-deferred-value"];

export const metadata: Metadata = {
  title: example.title,
  description: example.description,
  keywords: example.tags,
};

export default metadata;
