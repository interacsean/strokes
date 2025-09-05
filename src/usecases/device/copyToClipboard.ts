export function copyToClipboard(text: string, alertOnFail = false): void {
  // For Android WebView/Chrome, there's often a ~20KB limit
  // Try multiple methods to handle large text
  
  const copyWithClipboardAPI = async () => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard via Clipboard API");
      return true;
    } catch (err) {
      console.error("Clipboard API failed: ", err);
      return false;
    }
  };

  const copyWithExecCommand = () => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Make it invisible but keep it in the document flow
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    // For Android, also try setSelectionRange
    try {
      textArea.setSelectionRange(0, text.length);
    } catch (e) {
      // Ignore if not supported
    }

    let successful = false;
    try {
      successful = document.execCommand("copy");
      if (successful) {
        console.log("Text copied to clipboard via execCommand");
      } else {
        console.error("execCommand('copy') returned false");
        if (alertOnFail && text.length > 20000) {
          alert(`The text is too large to copy (${text.length} characters). Android has a ~20KB limit for clipboard operations. Consider downloading the data as a file instead.`);
        }
      }
    } catch (err) {
      console.error("execCommand failed: ", err);
      if (alertOnFail && text.length > 20000) {
        alert(`Failed to copy large text (${text.length} characters). Android has a ~20KB limit for clipboard operations.`);
      }
    }

    document.body.removeChild(textArea);
    return successful;
  };

  // Try Clipboard API first if available
  if (navigator.clipboard && window.isSecureContext) {
    copyWithClipboardAPI().then((success) => {
      if (!success) {
        // Fallback to execCommand
        copyWithExecCommand();
      }
    });
  } else {
    // Use execCommand directly
    copyWithExecCommand();
  }
}
