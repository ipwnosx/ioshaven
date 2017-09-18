<template lang="html">
<div class="modal fade" id="contactform" tabindex="-1" role="dialog" aria-labelledby="contactformlabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="contactformlabel">Contact Us for any problems or feedback.</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
            <label for="firstname" class="begin">Name:</label>
            <input v-model="firstName" type="text" class="form-control inputfield" id="firstname" name="firstname" placeholder="Your name..." required />

            <label for="email" class="begin">Email:</label>
            <input v-model="email" type="email" class="inputfield" id="email" name="email" placeholder="Your email..." required />

            <label for="subject" class="begin">Subject:</label>
            <input v-model="subject" type="text" class="form-control inputfield" id="subject" name="firstname" placeholder="Your subject..." required />

            <label for="contact" class="begin">Your Message:</label>
            <textarea v-model="body" id="contact" class="inputfield" name="contact" placeholder="Write something here..." style="height:200px" required></textarea>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger border" data-dismiss="modal">Close</button>
            <button @click="send" class="btn btn-primary border">Send</button>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
export default {
  data() {
    return {
      firstName: "",
      email: "",
      body: "",
      subject: ""
    }
  },
  methods: {
    validate(id, str = "") {
      var content = $(id).val()
      if (!_.includes(content, str)) $(id).addClass("is-invalid")
      else if (content.length <= 0) $(id).addClass("is-invalid")
      else {
        $(id).addClass("is-valid")
        $(id).removeClass("is-invalid")
        return true
      }
      return false
    },
    send() {
      if (
        this.validate("#firstname") &&
        this.validate("#email", "@") &&
        this.validate("#contact") &&
        this.validate('#subject')
      ) {
        axios.post("/contact", {
            firstName: this.firstName,
            email: this.email,
            body: this.body,
            subject: this.subject
          })
          .then(function(response) {
            $("#firstname").val("")
            $("#email").val("")
            $("#contact").val("")
            $("#subject").val("")
            $("#contactform").modal("toggle")
          })
      }
    }
  },
  mounted() {
    $('#firstname').focus()
  }
}
</script>

<style lang="css">
.modal-title {
  color: black;
  text-align: center;
  margin-top: 30px;
}

.border {
  border: none !important;
}

.begin {
  color: black;
  padding-top: 10px;
}
.inputfield {
  color: black !important;
  font-size: 15px;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: white !important;
  border: 1px black solid !important;
}
.inputfield:focus {
  box-shadow: 0 0 0 2px #121212 !important;
}

.inputfield.is-valid {
  border: 1px green solid !important;
}

.inputfield.is-valid:focus {
    box-shadow: 0 0 0 2px green !important;
}

.inputfield.is-invalid {
  border: 1px red solid !important;
}

.inputfield.is-invalid:focus {
  box-shadow: 0 0 0 2px red !important;
}

::-webkit-input-placeholder {
  color: black !important;
  opacity: 1.0;
}

:-moz-placeholder {
  color: black !important;
  opacity: 1.0;
}

:-ms-input-placeholder {
  color: black !important;
  opacity: 1.0;
}
</style>
