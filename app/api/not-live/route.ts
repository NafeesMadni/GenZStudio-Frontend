import { NextResponse } from "next/server";

const message = `
    <div style="color: #7f8c8d; font-size: 1em;">
        <strong>API Not Live Yet</strong> <br />
        Our API is currently under development and not live yet. We're working hard to bring you an amazing experience soon! <br />
        Stay tuned for updates and announcements. <br />
        🔗 Check out our progress on GitHub: <a href="https://github.com/NafeesMadni" style="color: #3498db;"  target="_blank">@NafeesMadni</a> <br />
        For collaborations or questions, email <a href="mailto:genzstudio07@gmail.com" style="color: #3498db;" target="_blank">genzstudio07@gmail.com</a>.
        <div style="text-align: right; font-size: 0.90em; color: #95a5a6;">
            A project by <a href="https://www.instagram.com/real.nafees" style="color: #3498db; text-decoration: none;" target="_blank">@real.nafees</a>
        </div>
    </div>
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
