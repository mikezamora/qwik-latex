import { $, component$, useOnDocument, useStore } from "@builder.io/qwik";

export const ClipboardInput = component$<{ class?: string }>((props) => {
  // Create a store to hold the clipboard text
  const clipboardStore = useStore({ text: "" });

  // Function to update clipboard text
  const updateClipboardText = $(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      clipboardStore.text = clipboardText;
    } catch (error) {
      console.error("Failed to read clipboard: ", error);
    }
  });

  // Effect to monitor clipboard changes when the component is mounted
  useOnDocument(
    "load",
    $(() => {
      // Check clipboard initially
      updateClipboardText();

      // Set up an interval to periodically check the clipboard
      const intervalId = setInterval(() => {
        updateClipboardText();
      }, 1000); // Polling every 1 second

      // Clean up the interval when the component unmounts
      return () => clearInterval(intervalId);
    }),
  );

  return (
    <input
      id="clipboard-input"
      type="text"
      value={clipboardStore.text}
      readOnly
      class={props.class}
    />
  );
});
