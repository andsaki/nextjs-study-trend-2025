"use client";

import Image from "next/image";
import { Button } from "@/src/design-system/components";
import { ExternalLink } from "lucide-react";

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fafafa',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <main style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '48rem',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8rem 4rem',
        backgroundColor: '#ffffff'
      }}>
        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          textAlign: 'center'
        }}>
          <h1 style={{
            maxWidth: '20rem',
            fontSize: '1.875rem',
            fontWeight: 600,
            lineHeight: 1.4,
            letterSpacing: '-0.025em',
            color: '#212121'
          }}>
            To get started, edit the page.tsx file.
          </h1>
          <p style={{
            maxWidth: '28rem',
            fontSize: '1.125rem',
            lineHeight: 1.8,
            color: '#616161'
          }}>
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              style={{
                fontWeight: 500,
                color: '#1976d2',
                textDecoration: 'underline'
              }}
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              style={{
                fontWeight: 500,
                color: '#1976d2',
                textDecoration: 'underline'
              }}
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          fontSize: '1rem',
          fontWeight: 500
        }}>
          <Button
            variant="primary"
            size="lg"
            icon={<ExternalLink size={16} />}
            onClick={() => window.open('https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app', '_blank')}
          >
            Deploy Now
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.open('https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app', '_blank')}
          >
            Documentation
          </Button>
        </div>
      </main>
    </div>
  );
}
