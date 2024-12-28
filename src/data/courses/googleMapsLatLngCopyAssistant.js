/**
 * Paste into a GMaps window.  When you copy the latlng, pressing the button will transform the format into object format used in the map type
 */

function addClipboardTransformButton() {
  // Create the button element
  const button = document.createElement('button');
  button.textContent = 'Transform Clipboard Coordinates';
  button.style.position = 'fixed';
  button.style.bottom = '0';
  button.style.left = '0';
  button.style.padding = '10px 20px';
  button.style.backgroundColor = "cyan";
  button.style.zIndex = '1000';

  // Append the button to the body
  document.body.appendChild(button);

  // Add click event listener to the button
  button.addEventListener('click', async () => {
    try {
      // Read from the clipboard
      const text = await navigator.clipboard.readText();
      
      // Match the coordinates pattern
      const match = text.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
      if (!match) {
        throw new Error("Clipboard does not contain valid coordinates.");
      }

      // Extract latitude and longitude
      const [_, lat, lng] = match;

      // Transform the coordinates
      const transformedText = `lat: ${lat},\n          lng: ${lng},`;

      // Write the transformed text back to the clipboard
      await navigator.clipboard.writeText(transformedText);

      console.log("Clipboard transformed successfully!");
    } catch (error) {
      console.error("Error transforming clipboard:", error);
    }
  });
}

// Call the function to add the button
addClipboardTransformButton();