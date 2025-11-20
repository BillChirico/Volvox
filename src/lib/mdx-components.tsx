import type { HTMLAttributes, ImgHTMLAttributes, ReactElement } from "react";
import { isValidElement } from "react";
import { Callout, CodeBlock, ImageZoom } from "@/components/mdx";
import { HeadingWithAnchor } from "@/components/blog/heading-with-anchor";

export const mdxComponents = {
  // Custom components that can be used directly in MDX
  Callout,

  // Headings with anchor links
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <HeadingWithAnchor as="h2" {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <HeadingWithAnchor as="h3" {...props} />
  ),

  // Override default HTML elements
  pre: ({ children }: HTMLAttributes<HTMLPreElement> & { children?: ReactElement<{ className?: string; filename?: string }> }) => {
    // Extract the code element and its props
    const codeElement = children;
    const className = codeElement?.props.className || "";
    const filename = codeElement?.props.filename;

    return (
      <CodeBlock className={className} filename={filename}>
        {children}
      </CodeBlock>
    );
  },

  code: ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
    // Inline code (not in pre)
    if (!className) {
      return <code {...props}>{children}</code>;
    }
    // Code block (will be wrapped by pre)
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  img: ({ src, alt, width, height, ...props }: ImgHTMLAttributes<HTMLImageElement> & { "data-caption"?: string }) => {
    // Use caption from data attribute if provided
    const caption = props["data-caption"];

    return (
      <ImageZoom
        src={typeof src === "string" ? src : ""}
        alt={alt || ""}
        width={typeof width === "string" ? Number.parseInt(width, 10) || undefined : width}
        height={typeof height === "string" ? Number.parseInt(height, 10) || undefined : height}
        caption={caption}
      />
    );
  },

  // Enhanced table styling
  table: ({ children, ...props }: HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full" {...props}>
        {children}
      </table>
    </div>
  ),

  // Task lists
  li: ({ children, ...props }: HTMLAttributes<HTMLLIElement>) => {
    // Check if this is a task list item
    if (
      isValidElement(children) &&
      (children.props as { type?: string }).type === "checkbox"
    ) {
      return (
        <li className="flex items-start gap-2 list-none" {...props}>
          {children}
        </li>
      );
    }
    return <li {...props}>{children}</li>;
  },
};
