import { NextResponse } from "next/server";

const message = `
    <p>
    <strong>API Not Live Yet</strong> <br />
    Our API is currently under development and not live yet. We're working hard to bring you an amazing experience soon! <br />
    Stay tuned for updates and announcements. <br />
    🔗 Check out our progress on GitHub: <a href="https://github.com/NafeesMadni"><u>@NafeesMadni</u></a> <br />
    📷 Connect on Instagram: <a href="https://www.instagram.com/real.nafees"><u>@real.nafees</u></a> <br />
    For any queries or collaborations, feel free to reach out! 🚀
    </p>
`;

export async function GET() {
    return NextResponse.json({
        data: "",
        message:message,
        error: true
    });
}

export async function POST() {
    return NextResponse.json({ 
        data: "",
        message:message,
        error: true
    });
}

export async function PUT() {
    return NextResponse.json({ 
        data: "",
        message:message,
        error: true
    });
}

export async function DELETE() {
    return NextResponse.json({ 
        data: "",
        message:message,
        error: true
    });
}
