import React, { useState, useRef, useEffect } from 'react';
import { spacing, typography, radii, accessibilityLevels } from '../tokens';
import { primitive } from '../tokens/colors';
import { useTheme } from '../theme';
import type { WCAGLevel } from '../tokens';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  /** ラベルテキスト */
  label: string;
  /** 選択肢 */
  options: DropdownOption[];
  /** 選択された値 */
  value?: string;
  /** プレースホルダー */
  placeholder?: string;
  /** 変更時のコールバック */
  onChange?: (value: string) => void;
  /** エラーメッセージ */
  error?: string;
  /** ヘルプテキスト */
  helperText?: string;
  /** 無効化 */
  disabled?: boolean;
  /** 必須項目 */
  required?: boolean;
  /** WCAGレベル */
  wcagLevel?: WCAGLevel;
}

/**
 * カスタムドロップダウンコンポーネント
 *
 * 機能:
 * - 完全カスタマイズ可能なドロップダウンUI
 * - キーボード操作対応（矢印キー、Enter、Escape、Space）
 * - クリック外で閉じる
 * - アクセシビリティ対応（ARIA属性）
 */
export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  placeholder = '選択してください',
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  wcagLevel = 'AA',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isKeyboardFocus, setIsKeyboardFocus] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { colors } = useTheme();
  const levelFocus = accessibilityLevels.focus[wcagLevel];

  const selectedOption = options.find(opt => opt.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const autoId = React.useId();
  const buttonId = `dropdown-button-${autoId}`;
  const listId = `dropdown-list-${autoId}`;
  const errorId = `dropdown-error-${autoId}`;
  const helperId = `dropdown-helper-${autoId}`;

  // キーボード/マウス検出
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardFocus(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardFocus(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // 外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // キーボード操作
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(options.findIndex(opt => opt.value === selectedValue));
        } else if (focusedIndex >= 0) {
          handleSelect(options[focusedIndex].value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex(prev =>
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
        }
        break;
    }
  };

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const toggleOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setFocusedIndex(options.findIndex(opt => opt.value === selectedValue));
      }
    }
  };

  return (
    <div style={{ marginBottom: spacing.scale[4] }} ref={dropdownRef}>
      {/* ラベル */}
      <label
        htmlFor={buttonId}
        style={{
          display: 'block',
          marginBottom: spacing.scale[2],
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.medium,
          color: colors.text.primary,
        }}
      >
        {label}
        {required && (
          <span
            style={{
              color: colors.text.error,
              marginLeft: spacing.scale[1],
            }}
            aria-label="必須"
          >
            *
          </span>
        )}
      </label>

      {/* ドロップダウンボタン */}
      <div style={{ position: 'relative' }}>
        <button
          ref={buttonRef}
          id={buttonId}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={buttonId}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          onClick={toggleOpen}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            padding: `${spacing.scale[3]} ${spacing.scale[4]}`,
            paddingRight: spacing.scale[10],
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.normal,
            textAlign: 'left',
            backgroundColor: disabled ? colors.background.disabled : colors.background.paper,
            color: selectedValue ? colors.text.primary : colors.text.secondary,
            border: error
              ? `2px solid ${colors.border.error}`
              : `2px solid ${colors.border.default}`,
            borderRadius: radii.borderRadius.md,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            outline: isKeyboardFocus ? `${levelFocus.outlineWidth} solid ${levelFocus.outline}` : 'none',
            outlineOffset: levelFocus.outlineOffset,
          }}
          onFocus={(e) => {
            if (isKeyboardFocus) {
              e.currentTarget.style.backgroundColor = levelFocus.background;
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.backgroundColor = disabled ? colors.background.disabled : colors.background.paper;
          }}
        >
          {displayText}

          {/* 矢印アイコン */}
          <span
            style={{
              position: 'absolute',
              right: spacing.scale[3],
              top: '50%',
              transform: isOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
              transition: 'transform 0.2s',
              pointerEvents: 'none',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={disabled ? colors.text.disabled : colors.text.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>

        {/* ドロップダウンメニュー */}
        {isOpen && (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={buttonId}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: spacing.scale[1],
              padding: spacing.scale[1],
              backgroundColor: colors.background.paper,
              border: `2px solid ${colors.border.default}`,
              borderRadius: radii.borderRadius.md,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              maxHeight: '240px',
              overflowY: 'auto',
              zIndex: 1000,
              listStyle: 'none',
              margin: `${spacing.scale[1]} 0 0 0`,
            }}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={selectedValue === option.value}
                onClick={() => !option.disabled && handleSelect(option.value)}
                onMouseEnter={() => setFocusedIndex(index)}
                style={{
                  padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
                  fontSize: typography.fontSize.base,
                  color: option.disabled ? colors.text.disabled : colors.text.primary,
                  backgroundColor:
                    focusedIndex === index
                      ? primitive.blue[50]
                      : selectedValue === option.value
                      ? primitive.blue[100]
                      : 'transparent',
                  borderRadius: radii.borderRadius.sm,
                  cursor: option.disabled ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.15s',
                  fontWeight: selectedValue === option.value ? typography.fontWeight.semibold : typography.fontWeight.normal,
                }}
              >
                {option.label}
                {selectedValue === option.value && (
                  <span style={{ marginLeft: spacing.scale[2], color: primitive.blue[600] }}>✓</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* エラーメッセージ */}
      {error && (
        <p
          id={errorId}
          role="alert"
          style={{
            marginTop: spacing.scale[1],
            fontSize: typography.fontSize.sm,
            color: colors.text.error,
          }}
        >
          {error}
        </p>
      )}

      {/* ヘルプテキスト */}
      {helperText && !error && (
        <p
          id={helperId}
          style={{
            marginTop: spacing.scale[1],
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};
