import styles from "./styles.css?url";

export const Document: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>C&B Wordle | ❤️</title>
      <link rel="modulepreload" href="/src/client.tsx" />
      <link rel="stylesheet" href={styles} />
      <meta
        name="description"
        content="Play Cathi and Brian's favorite game, with a wedding twist."
      />
      <meta name="title" content="C&B Wordle | ❤️" />
    </head>
    <body>
      <div id="root">{children}</div>
      <script>import("/src/client.tsx")</script>
    </body>
  </html>
);
