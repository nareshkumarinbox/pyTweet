from django.contrib.auth.models import User
from django import forms
from django.contrib.auth.hashers import make_password


class RegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())
    password2 = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'password', 'password2']

    def clean(self):
        cleaned_data = super(RegistrationForm, self).clean()

        username = cleaned_data.get('username')
        email = cleaned_data.get('email')
        password1 = cleaned_data.get('password')
        password2 = cleaned_data.get('password2')

        if User.objects.filter(username=username).exists():
            self._errors['username'] = self.error_class(['Given user name taken'])
        elif User.objects.filter(email=email).exists():
            self._errors['email'] = self.error_class(['Given email taken'])

        if not(password1 and password2):
            self._errors['password'] = self.error_class(['password and confirm password are required'])
        elif password1 != password2:
            self._errors['password'] = self.error_class(['Mismatch password'])

        return cleaned_data

    def make_save(self):
        user = self.save(False)
        user.password = self.make_password()
        user.save()

    def make_password(self):
        return make_password(self.cleaned_data.get('password'))

    def get_user_name(self):
        return self.cleaned_data.get('username')
