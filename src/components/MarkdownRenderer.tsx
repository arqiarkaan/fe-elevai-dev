import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  children: string;
  className?: string;
}

export function MarkdownRenderer({
  children,
  className = '',
}: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        components={{
          // Ordered list
          ol: ({ ...props }) => (
            <ol
              className="list-decimal list-outside ml-6 my-4 space-y-2"
              {...props}
            />
          ),
          // Unordered list
          ul: ({ ...props }) => (
            <ul
              className="list-disc list-outside ml-6 my-4 space-y-2"
              {...props}
            />
          ),
          // List item
          li: ({ ...props }) => <li className="leading-7" {...props} />,
          // Paragraphs
          p: ({ ...props }) => <p className="my-3 leading-7" {...props} />,
          // Headings
          h1: ({ ...props }) => (
            <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="text-xl font-bold mt-5 mb-3" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="text-lg font-bold mt-4 mb-2" {...props} />
          ),
          h4: ({ ...props }) => (
            <h4 className="text-base font-bold mt-3 mb-2" {...props} />
          ),
          // Strong/Bold
          strong: ({ ...props }) => (
            <strong className="font-bold text-foreground" {...props} />
          ),
          // Emphasis/Italic
          em: ({ ...props }) => <em className="italic" {...props} />,
          // Code block
          code: ({ ...props }) => (
            <code
              className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
              {...props}
            />
          ),
          // Blockquote
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
              {...props}
            />
          ),
          // Horizontal rule
          hr: ({ ...props }) => (
            <hr className="my-6 border-border" {...props} />
          ),
          // Links
          a: ({ ...props }) => (
            <a
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
