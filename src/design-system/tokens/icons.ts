/**
 * アイコントークン
 *
 * lucide-reactのアイコンを一元管理
 * デザインシステム全体で一貫したアイコンを使用
 */

import {
  // デザイン哲学
  Sparkles,    // 💫 心地よさを感じる体験
  HandHeart,   // 🤝 誰一人として置き去りにしない
  Sprout,      // 🌱 成長し続ける仕組み
  Flower2,     // 🌸 優しい体験

  // コンポーネント
  MousePointer2,  // 🔘 Button
  FileText,       // 📝 Input
  ClipboardList,  // 📋 Form/Modal
  FolderOpen,     // 📁 Accordion
  Bell,           // 🔔 Toast
  Navigation,     // 🧭 Breadcrumbs
  Type,           // 🔤 Text
  Target,         // 🎯 WCAG
  Palette,        // 🎨 Design Tokens
  Rainbow,        // 🌈 デザイン哲学

  // その他
  Moon,
  Sun,
} from 'lucide-react';

/**
 * デザイン哲学のアイコン
 */
export const philosophy = {
  kind: Flower2,        // 優しい体験
  inclusive: HandHeart, // 誰一人として置き去りにしない
  pleasant: Sparkles,   // 心地よさを感じる体験
  scalable: Sprout,     // 成長し続ける仕組み
  overview: Rainbow,    // デザイン哲学全体
} as const;

/**
 * コンポーネントのアイコン
 */
export const component = {
  button: MousePointer2,
  input: FileText,
  form: ClipboardList,
  modal: ClipboardList,
  accordion: FolderOpen,
  toast: Bell,
  text: Type,
  breadcrumbs: Navigation,
  navigation: Navigation,
} as const;

/**
 * 機能・概念のアイコン
 */
export const concept = {
  wcag: Target,
  designTokens: Palette,
  theme: {
    light: Sun,
    dark: Moon,
  },
} as const;

/**
 * すべてのアイコンを統合
 */
export const icons = {
  philosophy,
  component,
  concept,
} as const;

export type IconTokens = typeof icons;
