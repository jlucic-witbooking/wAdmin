package com.witbooking.admin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.witbooking.admin.domain.AuthorizedEstablishmentUser;
import com.witbooking.admin.repository.AuthorizedEstablishmentUserRepository;
import com.witbooking.admin.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.net.URI;
import java.net.URISyntaxException;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * REST controller for managing AuthorizedEstablishmentUser.
 */
@RestController
@RequestMapping("/api")
public class AuthorizedEstablishmentUserResource {

    private final Logger log = LoggerFactory.getLogger(AuthorizedEstablishmentUserResource.class);

    @Inject
    private AuthorizedEstablishmentUserRepository authorizedEstablishmentUserRepository;

    /**
     * POST  /authorizedEstablishmentUsers -> Create a new authorizedEstablishmentUser.
     */
    @RequestMapping(value = "/authorizedEstablishmentUsers",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> create(@RequestBody AuthorizedEstablishmentUser authorizedEstablishmentUser) throws URISyntaxException {
        log.debug("REST request to save AuthorizedEstablishmentUser : {}", authorizedEstablishmentUser);
        if (authorizedEstablishmentUser.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new authorizedEstablishmentUser cannot already have an ID").build();
        }
        authorizedEstablishmentUserRepository.save(authorizedEstablishmentUser);
        return ResponseEntity.created(new URI("/api/authorizedEstablishmentUsers/" + authorizedEstablishmentUser.getId())).build();
    }

    /**
     * PUT  /authorizedEstablishmentUsers -> Updates an existing authorizedEstablishmentUser.
     */
    @RequestMapping(value = "/authorizedEstablishmentUsers",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> update(@RequestBody AuthorizedEstablishmentUser authorizedEstablishmentUser) throws URISyntaxException {
        log.debug("REST request to update AuthorizedEstablishmentUser : {}", authorizedEstablishmentUser);
        if (authorizedEstablishmentUser.getId() == null) {
            return create(authorizedEstablishmentUser);
        }
        authorizedEstablishmentUserRepository.save(authorizedEstablishmentUser);
        return ResponseEntity.ok().build();
    }

    /**
     * GET  /authorizedEstablishmentUsers -> get all the authorizedEstablishmentUsers.
     */
    @RequestMapping(value = "/authorizedEstablishmentUsers",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<AuthorizedEstablishmentUser>> getAll(@RequestParam(value = "page" , required = false) Integer offset,
                                  @RequestParam(value = "per_page", required = false) Integer limit)
        throws URISyntaxException {
        Page<AuthorizedEstablishmentUser> page = authorizedEstablishmentUserRepository.findAll(PaginationUtil.generatePageRequest(offset, limit));
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/authorizedEstablishmentUsers", offset, limit);
        return new ResponseEntity<List<AuthorizedEstablishmentUser>>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /authorizedEstablishmentUsers/:id -> get the "id" authorizedEstablishmentUser.
     */
    @RequestMapping(value = "/authorizedEstablishmentUsers/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<AuthorizedEstablishmentUser> get(@PathVariable Long id, HttpServletResponse response) {
        log.debug("REST request to get AuthorizedEstablishmentUser : {}", id);
        AuthorizedEstablishmentUser authorizedEstablishmentUser = authorizedEstablishmentUserRepository.findOne(id);
        if (authorizedEstablishmentUser == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(authorizedEstablishmentUser, HttpStatus.OK);
    }

    /**
     * DELETE  /authorizedEstablishmentUsers/:id -> delete the "id" authorizedEstablishmentUser.
     */
    @RequestMapping(value = "/authorizedEstablishmentUsers/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public void delete(@PathVariable Long id) {
        log.debug("REST request to delete AuthorizedEstablishmentUser : {}", id);
        authorizedEstablishmentUserRepository.delete(id);
    }
}
