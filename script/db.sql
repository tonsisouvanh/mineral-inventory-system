use mineralstock;

select * from users;

INSERT INTO
    users (
        type,
        email,
        email_verified_at,
        password,
        remember_token,
        role,
        phone,
        name,
        gender,
        dob,
        province,
        district,
        village,
        remarks,
        created_at,
        updated_at,
        banned_at
    )
VALUES (
        'admin',
        'admin@example.com',
        '2023-01-01 00:00:00',
        'hashedpassword',
        'token123',
        'ADMIN',
        '1234567890',
        'Admin User',
        'Male',
        '1990-01-01',
        'Province1',
        'District1',
        'Village1',
        'No remarks',
        NOW(),
        NOW(),
        NULL
    ),
    (
        'user',
        'user@example.com',
        NULL,
        'hashedpassword',
        NULL,
        'USER',
        '0987654321',
        'Regular User',
        'Female',
        '1995-05-05',
        'Province2',
        'District2',
        'Village2',
        'No remarks',
        NOW(),
        NOW(),
        NULL
    );

INSERT INTO
    users (
        type,
        email,
        email_verified_at,
        password,
        remember_token,
        role,
        phone,
        name,
        gender,
        dob,
        province,
        district,
        village,
        remarks,
        created_at,
        updated_at,
        banned_at
    )
VALUES (
        'test',
        'test@example.com',
        '2023-01-01 00:00:00',
        'hashedpassword',
        'token123',
        'TEST',
        '1234567890',
        'Admin User',
        'Male',
        '1990-01-01',
        'Province1',
        'District1',
        'Village1',
        'No remarks',
        NOW(),
        NOW(),
        NULL
    )