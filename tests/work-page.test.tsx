import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import zh from '@/messages/zh.json';
import WorkContent from '@/app/[locale]/work/[slug]/work-content';

describe('專案詳情頁', () => {
  it('渲染指定專案的名稱、描述與外部連結', () => {
    render(
      <NextIntlClientProvider locale="zh" messages={zh}>
        <WorkContent slug="pos-cloud" locale="zh" />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole('heading', { name: /POS Cloud/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sweet-pos/ })).toHaveAttribute('href', 'https://sweet-pos.vercel.app/');
  });
});
