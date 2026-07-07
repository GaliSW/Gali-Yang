import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import zh from '@/messages/zh.json';
import Gate from '@/components/sections/Gate';
import Systems from '@/components/sections/Systems';

const wrap = (ui: React.ReactNode) => (
  <NextIntlClientProvider locale="zh" messages={zh}>{ui}</NextIntlClientProvider>
);

describe('板塊元件', () => {
  it('Gate 的兩顆按鈕觸發 callback', () => {
    const onEnter = vi.fn(); const onRead = vi.fn();
    render(wrap(<Gate active locale="zh" onEnter={onEnter} onRead={onRead} />));
    fireEvent.click(screen.getByRole('button', { name: /進入體驗/ }));
    fireEvent.click(screen.getByRole('button', { name: /閱讀靜態版/ }));
    expect(onEnter).toHaveBeenCalledOnce();
    expect(onRead).toHaveBeenCalledOnce();
  });
  it('Systems 依 step 顯示對應專案', () => {
    const { rerender } = render(wrap(<Systems active step={0} locale="zh" />));
    expect(screen.getByText(/POS Cloud/)).toBeVisible();
    rerender(wrap(<Systems active step={2} locale="zh" />));
    expect(screen.getByText(/Longevity/)).toBeVisible();
  });
});
