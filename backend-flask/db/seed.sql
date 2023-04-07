-- this file was manually created
INSERT INTO public.users (display_name, email, handle, cognito_user_id)
VALUES
  ('Marcrine Musimbi', 'marcrinemm@gmail.com', 'marcrine' ,'MOCK'),
  ('Andrea Mikaels', 'marcrine99@gmail.com','andrea' ,'MOCK'),
  ('Davina Claire', 'davina@gmail.com', 'davina' ,'MOCK');

INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES
  (
    (SELECT uuid from public.users WHERE users.handle = 'marcrine' LIMIT 1),
    'This was imported as seed data!',
    current_timestamp + interval '10 day'
  )
