function scrollToContact() {
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  }
  
  function handleSubmit(event) {
    event.preventDefault();
    alert("Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.");
  }