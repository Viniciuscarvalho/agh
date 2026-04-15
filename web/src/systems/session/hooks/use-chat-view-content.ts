import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import type { UIMessage } from "../types";
import { estimateRowHeight, getRowKey, useStableRows } from "./use-chat-view-rows";

const BOTTOM_LOCK_THRESHOLD_PX = 80;

export interface UseChatViewContentOptions {
  messages: UIMessage[];
  isStreaming: boolean;
}

export function useChatViewContent({ messages, isStreaming }: UseChatViewContentOptions) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomLockedRef = useRef(true);
  const userScrollIntentRef = useRef(0);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const rows = useStableRows(messages, isStreaming);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: index => estimateRowHeight(rows[index]),
    overscan: 10,
    getItemKey: index => getRowKey(rows[index], index),
  });

  const scrollToBottom = useCallback(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }

    element.scrollTop = element.scrollHeight;
    bottomLockedRef.current = true;
    setShowScrollButton(false);
  }, []);

  const scheduleFollowBottom = useCallback(() => {
    if (!bottomLockedRef.current) {
      return;
    }

    requestAnimationFrame(() => {
      const element = scrollRef.current;
      if (element && bottomLockedRef.current) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }, []);

  useEffect(() => {
    scheduleFollowBottom();
  }, [rows.length, scheduleFollowBottom]);

  useEffect(() => {
    if (!isStreaming) {
      return;
    }

    const element = scrollRef.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver(() => {
      scheduleFollowBottom();
    });

    const innerContent = element.firstElementChild;
    if (innerContent) {
      observer.observe(innerContent);
    }

    return () => observer.disconnect();
  }, [isStreaming, scheduleFollowBottom]);

  useLayoutEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, []);

  const markUserIntent = useCallback(() => {
    userScrollIntentRef.current = Date.now() + 250;
  }, []);

  const handleScroll = useCallback(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = element;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const hasRecentUserIntent = Date.now() <= userScrollIntentRef.current;

    if (hasRecentUserIntent && distanceFromBottom > BOTTOM_LOCK_THRESHOLD_PX) {
      bottomLockedRef.current = false;
      setShowScrollButton(true);
      return;
    }

    if (distanceFromBottom <= BOTTOM_LOCK_THRESHOLD_PX) {
      bottomLockedRef.current = true;
      setShowScrollButton(false);
    }
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }

    element.addEventListener("wheel", markUserIntent, { passive: true });
    element.addEventListener("touchmove", markUserIntent, { passive: true });

    return () => {
      element.removeEventListener("wheel", markUserIntent);
      element.removeEventListener("touchmove", markUserIntent);
    };
  }, [markUserIntent]);

  return {
    handleScroll,
    markUserIntent,
    rows,
    scrollRef,
    scrollToBottom,
    showScrollButton,
    virtualizer,
  };
}
