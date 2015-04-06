package com.witbooking.admin.security;

/**
 * Created by mongoose on 6/04/15.
 * This class extends the role/right based authority by defining a domain Object Identifier (DOI)
 * to which the given authority pertains to. Note that it could be approached as an ACL architecture,
 * however, for the business logic at hand this would be overkill, as there is no need for row-level/object-level
 * authorization for multiple objects, only one type at the moment (Establishments)
 */
public final class EstablishmentGrantedAuthority extends RightGrantedAuthority {

    private String domainObjectIdentifier;

    public String getDomainObjectIdentifier() {
        return domainObjectIdentifier;
    }

    public void setDomainObjectIdentifier(String domainObjectIdentifier) {
        this.domainObjectIdentifier = domainObjectIdentifier;
    }

    @Override
    public String getAuthority() {
        return null;
    }
}
