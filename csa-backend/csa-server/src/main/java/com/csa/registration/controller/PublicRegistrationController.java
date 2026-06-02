package com.csa.registration.controller;

/**
 * @author tanlja
 */

import com.csa.common.R;
import com.csa.registration.entity.CsaRegistration;
import com.csa.registration.service.CsaRegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "前台报名")
@RestController
@RequestMapping("/api/public/registrations")
@RequiredArgsConstructor
public class PublicRegistrationController {

    private final CsaRegistrationService csaRegistrationService;

    @Operation(summary = "提交报名申请")
    @PostMapping
    public R<CsaRegistration> submit(@RequestBody CsaRegistration reg) {
        try {
            CsaRegistration saved = csaRegistrationService.submit(reg);
            return R.ok(saved);
        } catch (RuntimeException e) {
            return R.fail(e.getMessage());
        }
    }

    @Operation(summary = "查询报名状态")
    @GetMapping("/query")
    public R<List<CsaRegistration>> query(@RequestParam(required = false) String phone,
                                           @RequestParam(required = false) String studentId,
                                           @RequestParam(required = false) String regNo) {
        List<CsaRegistration> list = csaRegistrationService.query(phone, studentId, regNo);
        return R.ok(list);
    }
}
