class AllForm(object):

    def get_errors(self):
        errors = self.errors.get_json_data()
        new_errors = {}
        for key,message_dicts in errors.items():
            messages = []
            for message in message_dicts:
                messages.append(message['message'])
            new_errors[key] = messages
        return new_errors