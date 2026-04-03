import { memo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { User, Bot } from "lucide-react";

import { cn } from "@/lib/utils";
import type { UIMessage } from "../types";
import { ThinkingBlock } from "./thinking-block";

export interface MessageBubbleProps {
  message: UIMessage;
}

const MemoizedMarkdown = memo(
  function MemoizedMarkdown({ content }: { content: string }) {
    return (
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className ?? "");
            const codeString = String(children).replace(/\n$/, "");

            if (match) {
              return (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: "0.5rem",
                    fontSize: "0.8125rem",
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              );
            }

            return (
              <code
                className={cn(
                  "rounded-md bg-[color:var(--ds-panel-accent)] px-1.5 py-0.5",
                  "text-[0.8125rem] text-[color:var(--ds-text-primary)]",
                  className
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          a({ children, href, ...props }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--ds-accent-amber)] underline underline-offset-2 hover:opacity-80"
                {...props}
              >
                {children}
              </a>
            );
          },
          pre({ children }) {
            return <div className="my-2 overflow-x-auto">{children}</div>;
          },
        }}
      >
        {content}
      </Markdown>
    );
  },
  (prev, next) => prev.content === next.content
);

export const MessageBubble = memo(
  function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === "user";

    return (
      <div
        className={cn("flex gap-3 px-4 py-3", isUser && "flex-row-reverse")}
        data-testid={`message-bubble-${message.role}`}
        data-message-id={message.id}
      >
        <div
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full",
            isUser
              ? "bg-[color:var(--ds-accent-amber)]/10 text-[color:var(--ds-accent-amber)]"
              : "bg-[color:var(--ds-accent-violet)]/10 text-[color:var(--ds-accent-violet)]"
          )}
        >
          {isUser ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
        </div>

        <div className={cn("min-w-0 max-w-[85%] flex-1", isUser && "flex flex-col items-end")}>
          {message.thinking && (
            <ThinkingBlock
              thinking={message.thinking}
              thinkingComplete={message.thinkingComplete}
            />
          )}

          {message.content && (
            <div
              className={cn(
                "prose prose-sm prose-invert max-w-none",
                "prose-p:my-1 prose-headings:mb-2 prose-headings:mt-4",
                "prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5",
                "prose-pre:my-0 prose-pre:bg-transparent prose-pre:p-0",
                "text-sm leading-relaxed",
                isUser
                  ? "text-[color:var(--ds-text-primary)]"
                  : "text-[color:var(--ds-text-secondary)]"
              )}
            >
              <MemoizedMarkdown content={message.content} />
            </div>
          )}

          {!message.content && message.isStreaming && (
            <span className="text-xs italic text-[color:var(--ds-text-muted)]">...</span>
          )}
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.message.id === next.message.id &&
    prev.message.content === next.message.content &&
    prev.message.thinking === next.message.thinking &&
    prev.message.thinkingComplete === next.message.thinkingComplete &&
    prev.message.isStreaming === next.message.isStreaming
);
