import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import zh from '@/messages/zh.json';
import InfoContent from '@/app/[locale]/info/info-content';

describe('/info 靜態版', () => {
  it('列出全部六個作品與聯絡方式', () => {
    render(
      <NextIntlClientProvider locale="zh" messages={zh}>
        <InfoContent locale="zh" />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText(/POS Cloud/)).toBeInTheDocument();
    expect(screen.getByText(/WooCommerce CRM/)).toBeInTheDocument();
    expect(screen.getByText(/Longevity/)).toBeInTheDocument();
    expect(screen.getByText(/Shuāng/)).toBeInTheDocument();
    expect(screen.getByText(/銘皇農場/)).toBeInTheDocument();
    expect(screen.getByText(/Sweet Square/)).toBeInTheDocument();
    expect(screen.getByText(/hello@yourname.dev/)).toBeInTheDocument();
  });
});
