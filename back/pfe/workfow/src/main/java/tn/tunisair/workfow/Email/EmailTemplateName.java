package tn.tunisair.workfow.Email;

public enum EmailTemplateName {
    NOTIFY_ISSUE("notify issue"),
    NOTIFY_CHANGE("notify change"),
    RECOVER_ACCOUNT("recover account"),
    NOTIFY_INCIDENT("notify incident"),
    ACTIVATE_ACCOUNT("activate account");

    private final String name;
    EmailTemplateName(String name) {
        this.name = name;
    }
}
